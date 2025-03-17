import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform/transform.interceptor';
import { HttpExceptionFilter } from './http-execption/http-execption.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api'); // 路由设置全局前缀
    app.useGlobalInterceptors(new TransformInterceptor()); // 全局拦截器--返回数据格式化
    app.useGlobalFilters(new HttpExceptionFilter()); //全局拦截器--异常过滤器
    app.enableCors(); // 允许跨域
    await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
