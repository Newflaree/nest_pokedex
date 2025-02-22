import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';


@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>
  ) {}
   

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const { data } = await this.axios.get<PokeResponse>( 'https://pokeapi.co/api/v2/pokemon?limit=650' );
    /*
    const insertPromisesArray = [];

    data.results.forEach( ({ name, url }) => {
      const segments = url.split( '/' );
      const no = +segments[ segments.length -2 ];

      //await this.pokemonModel.create({ name, no });
      insertPromisesArray.push(
        this.pokemonModel.create({ name, no })
      );
    });

    await Promise.all( insertPromisesArray );
     * */
    const pokemonsToInsert: { name: string, no: number }[] = [];

    data.results.forEach( ({ name, url }) => {
      const segments = url.split( '/' );
      const no = +segments[ segments.length -2 ];
      pokemonsToInsert.push({ name, no });
    });

    await this.pokemonModel.insertMany( pokemonsToInsert );
    return 'Seed Executed';
  }
}
