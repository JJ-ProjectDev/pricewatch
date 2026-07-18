import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('PriceWatch API')
    .setDescription(
      'API gateway for PriceWatch authentication, products, and health checks.',
    )
    .setVersion('0.1.0')
    .addTag('Health', 'Service availability checks')
    .addTag('Authentication', 'Registration, login, and authenticated profiles')
    .addTag('Products', 'Product catalogue queries')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'docs-json',
    customSiteTitle: 'PriceWatch API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
