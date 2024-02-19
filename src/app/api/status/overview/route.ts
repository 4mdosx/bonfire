import os from 'os'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const overview = {
    system: {
      platform: os.platform(),
      arch: os.arch()
    },
    cpus: {
      cpus: os.cpus(),
      cpuUsage: os.loadavg()
    },
    memory: {
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    },
    network: {
      networkInterfaces: os.networkInterfaces()
    },
    disk: {
      diskUsage: os.loadavg()
    }
  }

  return Response.json(overview)
}