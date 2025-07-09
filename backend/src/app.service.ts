import { Injectable } from '@nestjs/common'
import { join } from 'path'
import { PrismaService } from './infra/database/prisma.service'

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): any {
    const publicPath = join(__dirname, '..', 'dist')

    const returnMessage = {
      message: 'Hello World!!! ✈️✈️',
      LOCAL: process.env.NODE_ENV,
      PORT: process.env.PORT_ADMIN,
      date: new Date(),
      version: 2.3,
      webroot: { root: publicPath },
    }

    console.log(returnMessage)
    return {
      returnMessage,
    }
  }

  async getComplexAnalytics(): Promise<any> {
    try {
      console.log('🔍 Executing simplified analytics query...')

      // Execute the simplified analytics view query
      const analyticsData = await this.prisma.$queryRaw`
        SELECT * FROM workspace.simplified_analytics 
        ORDER BY engagement_score DESC 
        LIMIT 100
      `

      console.log(
        `✅ Analytics query completed. Returned ${Array.isArray(analyticsData) ? analyticsData.length : 0} records`,
      )

      return {
        success: true,
        timestamp: new Date(),
        recordCount: Array.isArray(analyticsData) ? analyticsData.length : 0,
        data: JSON.parse(JSON.stringify(analyticsData, this.serialize)),
        message: 'Simplified analytics data retrieved successfully',
      }
    } catch (error) {
      console.error('❌ Error executing analytics query:', error)

      return {
        success: false,
        timestamp: new Date(),
        error: {
          message: 'Failed to retrieve analytics data',
          details: error.message,
          hint: 'Make sure the database is running and the analytics view exists',
        },
      }
    }
  }

  serialize(_key: string, value: any): any {
    return typeof value === 'bigint' ? value.toString() : value
  }
}
