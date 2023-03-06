import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { FilesMicroServiceDto } from 'src/files/data/dto/file-ms.dto';

@Injectable()
export class RedisManagerService {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}
  /**
   * Set the object in Redis
   * @param key Key to identify the object
   * @param value Objet for the key
   */
  async setCache(key: string, value: FilesMicroServiceDto): Promise<string> {
    await this.cacheManager.set(key, value);
    return 'OK';
  }

  /**
   * Return the object that matches key in Redis
   * @param key Key to identify the object
   * @returns object when the item exist in Redis
   * @returns undefined when the item is not exist in Redis
   */
  async getCache(key: string): Promise<FilesMicroServiceDto | undefined> {
    const result = await this.cacheManager.get(key);
    if (!result) {
      return null;
    }

    return new FilesMicroServiceDto(result);
  }

  /**
   * Delete the object that matches key in Redis
   * @param key Key to delete from Redis
   * @returns 'OK' when succeeded
   */
  async deleteCache(key: string): Promise<string> {
    await this.cacheManager.del(key);
    return 'OK';
  }

  /**
   * Reset all the data stored in Redis
   * @returns 'OK' when succeeded
   */
  async resetCache(): Promise<string> {
    await this.cacheManager.reset();
    return 'OK';
  }
}
