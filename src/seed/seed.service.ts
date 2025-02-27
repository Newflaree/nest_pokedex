import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';


@Injectable()
export class SeedService {
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}
   

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>( 'https://pokeapi.co/api/v2/pokemon?limit=650' );
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
