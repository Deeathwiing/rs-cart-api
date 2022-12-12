import { Controller, Get, Delete, Put, Body, Post, HttpStatus } from '@nestjs/common';

import { OrderService } from '../order';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  @Get()
  async findUserCart() {
    console.log('[Cart controller] [GET]');
    const cart = await this.cartService.findOrCreateByUserId();

    console.log('[Cart controller] [GET] Founded cart', cart)
  
    const data = cart.items.map(item=>({
      product: {
        price: item.product.price,
        title: item.product.title,
        description: item.product.description,
        id: item.product.product_id
      },
      count: item.count
    })) 

    console.log('[Cart controller] [GET] Return data', data)
    return data;
  }

  @Put()
  async updateUserCart(@Body() body) {
    console.log('[Cart controller] [PUT]');

    console.log('[Cart controller] [PUT] Body', body)
    const cart = await this.cartService.updateByUserId(body)

    console.log('[Cart controller] [PUT] Updated cart', cart)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      }
    }
  }

  @Delete()
  async clearUserCart() {
    console.log('[Cart controller] [DELETE]');

    await this.cartService.removeByUserId();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  @Post('checkout')
  async checkout (@Body() body) {
    console.log('[Cart controller] [POST]');

    const cart = await this.cartService.findByUserId();

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);
    const order = this.orderService.create({
      ...body,
      cartId,
      items,
      total,
    });
    console.log('[Cart controller] [POST] Order', order);

    await this.cartService.removeByUserId();

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
