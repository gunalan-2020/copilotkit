import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chart } from './entities/chart.entity';
import { Dashboard } from '../dashboard/entities/dashboard.entity';
import { ChartService } from './chart.service';
import { ChartController } from './chart.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chart, Dashboard]), AuthModule],
  controllers: [ChartController],
  providers: [ChartService],
  exports: [ChartService],
})
export class ChartModule {}
