import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import { Products } from '../models';
import { ProductsRepository, TransactionsRepository } from '../repositories';

export class ProductsController {
  tempList: any = [];
  productsList: any;
  transactionList: any;
  constructor(
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository,
    @repository(TransactionsRepository)
    public transactionsRepository: TransactionsRepository,
  ) { }

  @post('/products')
  @response(200, {
    description: 'Products model instance',
    content: { 'application/json': { schema: getModelSchemaRef(Products) } },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, {
            title: 'NewProducts',
            exclude: ['id'],
          }),
        },
      },
    })
    products: Omit<Products, 'id'>,
  ): Promise<Products> {
    products.createdAt = Date.now()
    return this.productsRepository.create(products);
  }

  @get('/products/count')
  @response(200, {
    description: 'Products model count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async count(
    @param.where(Products) where?: Where<Products>,
  ): Promise<Count> {
    return this.productsRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Products model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Products, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Products) filter?: Filter<Products>,
  ): Promise<any[]> {
    this.productsList = await this.productsRepository.find();
    this.transactionList = await this.transactionsRepository.find();
    for (let product of this.productsList) {
      let sales = this.transactionList.filter((ele: any) => ele.productId == product.id).map((ele: any) => ele.quantity * ele.productPrice).reduce((acc: any, ele: any) => acc + ele, 0);
      product.sales = sales;
    }
    return this.productsList;
  }

  @get('/products/dropdown')
  @response(200, {
    description: 'Array of Products model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Products, { includeRelations: true }),
        },
      },
    },
  })
  async findProducts(
  ): Promise<Products[]> {
    this.productsList = await this.productsRepository.find();
    for (const result of this.productsList) {
      this.tempList.push({
        key: result.id,
        value: result.name,
        price: result.price
      });
    }
    return this.tempList;
  }

  @get('/products/sales')
  @response(200, {
    description: 'Array of Products model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Products, { includeRelations: true }),
        },
      },
    },
  })
  async findProductsSales(
  ): Promise<any> {
    this.productsList = await this.productsRepository.find();
    this.transactionList = await this.transactionsRepository.find();
    let labels = [], data = [], sales = 0;
    for (const product of this.productsList) {
      labels.push(product.name);
      let sales = this.transactionList.filter((ele: any) => ele.productId == product.id).map((ele: any) => ele.quantity * ele.productPrice).reduce((acc: any, ele: any) => acc + ele, 0);
      data.push(sales);
    }
    return { labels, data };
  }

  @patch('/products')
  @response(200, {
    description: 'Products PATCH success count',
    content: { 'application/json': { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, { partial: true }),
        },
      },
    })
    products: Products,
    @param.where(Products) where?: Where<Products>,
  ): Promise<Count> {
    return this.productsRepository.updateAll(products, where);
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Products model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Products, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Products, { exclude: 'where' }) filter?: FilterExcludingWhere<Products>
  ): Promise<Products> {
    return this.productsRepository.findById(id, filter);
  }

  @patch('/products/{id}')
  @response(204, {
    description: 'Products PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Products, { partial: true }),
        },
      },
    })
    products: Products,
  ): Promise<void> {
    await this.productsRepository.updateById(id, products);
  }

  @put('/products/{id}')
  @response(204, {
    description: 'Products PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() products: Products,
  ): Promise<void> {
    await this.productsRepository.replaceById(id, products);
  }

  @del('/products/{id}')
  @response(204, {
    description: 'Products DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productsRepository.deleteById(id);
  }
}
