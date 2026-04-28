import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const q = url.searchParams.get('q') || undefined
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')
    const radiusKm = Number(url.searchParams.get('radius') || 10)

    // Basic filter: text search
    const where: any = {}
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ]
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      take: 200,
    })

    // If location provided, compute simple Haversine distance in JS and filter
    if (lat && lon) {
      const userLat = Number(lat)
      const userLon = Number(lon)
      const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const toRad = (d: number) => (d * Math.PI) / 180
        const R = 6371
        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
      }

      const filtered = jobs
        .map((j:any) => ({
          ...j,
          distanceKm:
            j.lat != null && j.lon != null
              ? haversine(userLat, userLon, j.lat, j.lon)
              : null,
        }))
        .filter((j:any) => (j.distanceKm == null ? true : j.distanceKm <= radiusKm))
        .sort((a:any, b:any) => {
          if (a.distanceKm == null) return 1
          if (b.distanceKm == null) return -1
          return a.distanceKm - b.distanceKm
        })

      return NextResponse.json({ jobs: filtered })
    }

    return NextResponse.json({ jobs })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    // Expected payload: { title, description, salaryMin, salaryMax, lat, lon, source, url, company }
    const { company, ...jobData } = payload

    let companyRecord = null
    if (company && company.name) {
      companyRecord = await prisma.company.upsert({
        where: { name: company.name },
        update: {},
        create: { name: company.name, website: company.website },
      })
    }

    const created = await prisma.job.create({
      data: {
        title: jobData.title ?? 'Untitled',
        description: jobData.description ?? '',
        salaryMin: jobData.salaryMin,
        salaryMax: jobData.salaryMax,
        lat: jobData.lat,
        lon: jobData.lon,
        source: jobData.source,
        url: jobData.url,
        postedAt: jobData.postedAt ? new Date(jobData.postedAt) : undefined,
        company: companyRecord ? { connect: { id: companyRecord.id } } : undefined,
      },
    })

    return NextResponse.json({ job: created })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Could not create job' }, { status: 500 })
  }
}
