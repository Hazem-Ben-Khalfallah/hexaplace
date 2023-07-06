import { faker } from '@faker-js/faker';
import { UUID } from '@libs/ddd/domain/value-objects/uuid.value-object';
import { CreateProductCommand } from '@modules/catalog/commands/create-product/create-product.command';
import { CreateProductCommandHandler } from '@modules/catalog/commands/create-product/create-product.command-handler';
import { ProductInMemoryUnitOfWork } from '@modules/catalog/database/product.in-memory.unit-of-work';
import { ProductEntity } from '@modules/catalog/domain/entities/product.entity';
import { ProductStatus } from '@modules/catalog/domain/value-objects/product-status/product-status.enum';
import { ProductDescriptionRequiredError } from '@modules/catalog/errors/product/product-description-required.error';
import { ProductNameRequiredError } from '@modules/catalog/errors/product/product-name-required.error';

describe('Create an product', () => {
  let productInMemoryUnitOfWork: ProductInMemoryUnitOfWork;
  let createProductCommandHandler: CreateProductCommandHandler;

  beforeEach(() => {
    productInMemoryUnitOfWork = new ProductInMemoryUnitOfWork();

    createProductCommandHandler = new CreateProductCommandHandler(
      productInMemoryUnitOfWork,
    );
  });

  describe('when one or more required fields are missing', () => {
    it('should return an error when name is invalid', async () => {
      // given
      const createProductCommand: CreateProductCommand = new CreateProductCommand({
        name: '       ',
        description: faker.commerce.productDescription(),
      });
      // when
      await expect(createProductCommandHandler.execute(createProductCommand))
        // then
        .rejects.toThrow(ProductNameRequiredError);
    });

    it('should return an error when description is invalid', async () => {
      // given
      const createProductCommand: CreateProductCommand = new CreateProductCommand({
        name: faker.commerce.productName(),
        description: '         ',
      });
      // when
      await expect(createProductCommandHandler.execute(createProductCommand))
        // then
        .rejects.toThrow(ProductDescriptionRequiredError);
    });
  });

  describe('when one or more required fields are provided', () => {
    it('should create an product', async () => {
      // given
      const id = UUID.generate();
      const createProductCommand: CreateProductCommand = new CreateProductCommand({
        id: id.value,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      });

      // when
      await createProductCommandHandler.execute(createProductCommand);

      // then
      const product: ProductEntity =
        await productInMemoryUnitOfWork.getReadProductRepository().findOneByIdOrThrow(id);
      const productProps = product.getPropsCopy();
      expect(productProps?.status).toEqual(ProductStatus.DRAFT);
    });
  });
});
