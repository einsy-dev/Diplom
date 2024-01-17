import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelRoomService } from './hotel.room.servise';
import { ObjectId } from 'mongoose';
import { SearchRoomsParams } from './hotel.room.interface';
import { Hotel } from 'src/mongo/schemas/hotel.schema';
import { HotelRoom } from 'src/mongo/schemas/hotel.room.schema';
import { FilesInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { SearchHotelParams } from './hotel.interface';
import { diskStorage } from 'multer';
import * as uuid from 'uuid';

@Controller('api')
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomService: HotelRoomService,
  ) {}

  // Hotel
  @Get('hotels')
  async getHotels(@Query() query: SearchHotelParams) {
    return this.hotelService.find(query);
  }
  @Get('hotel/:id')
  async getHotel(@Param() { id }: { id: ObjectId }) {
    return this.hotelService.findById(id);
  }
  @Post('hotel')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: diskStorage({
        destination: './public/images',
        filename: (req, file, callback) => {
          const filename: string = uuid.v4() + '.jpg';
          callback(null, filename);
        },
      }),
    }),
  )
  async create(
    @Body() body: Partial<Hotel>,
    @UploadedFiles() files: any,
  ): Promise<any> {
    return await this.hotelService.create(body, files);
  }
  @Put('hotel/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(
    @Param() { id }: { id: ObjectId },
    @Body() data: Partial<Hotel>,
  ) {
    return this.hotelService.update({ id, params: data });
  }
  @Delete('hotel/:id')
  async delete(@Param() { id }: { id: ObjectId }) {
    return this.hotelService.delete(id);
  }

  // Hotel-room
  @Get('rooms')
  async getHotelRooms(@Query() query: SearchRoomsParams) {
    return this.roomService.find(query);
  }
  @Get('room/:id')
  async getHotelRoom(@Param() { id }: { id: ObjectId }) {
    return this.roomService.findById(id);
  }

  @Post('room')
  async createRoom(@Body() data: Partial<HotelRoom>) {
    return this.roomService.create(data);
  }

  @Put('room/:id')
  async updateRoom(
    @Param() { id }: { id: ObjectId },
    @Body() data: Partial<HotelRoom>,
  ) {
    return this.roomService.update({ id, params: data });
  }

  @Delete('room/:id')
  async deleteRoom(@Param() { id }: { id: ObjectId }) {
    return this.roomService.delete(id);
  }
}
