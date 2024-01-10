<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LifeExpectancyTableSeeder extends Seeder
{
    public function run()
    {
        $csvFiles = [
            '2004_life_table.csv',
            '2005_life_table.csv',
            '2006_life_table.csv',
            '2007_life_table.csv',
            '2009_life_table.csv',
            '2010_life_table.csv',
            '2011_life_table.csv',
            '2013_life_table.csv',
            '2014_life_table.csv',
            '2015_life_table.csv',
            '2016_life_table.csv',
            '2017_life_table.csv',
            '2019_life_table.csv',
            '2020_life_table.csv',
        ];


        foreach ($csvFiles as $file) {
            $csv = array_map('str_getcsv', file(storage_path('app/data/' . $file)));
            $headers = array_shift($csv);

            foreach ($csv as $row) {
                $data = array_combine($headers, $row);

                // Cast specific columns to their respective types
                $data['exact_age'] = (int) $data['exact_age'];
                $data['year'] = (int) $data['year'];
                $floatColumns = [
                    'male_death_probability',
                    'male_number_of_lives',
                    'male_life_expectancy',
                    'female_death_probability',
                    'female_number_of_lives',
                    'female_life_expectancy',
                ];
                foreach ($floatColumns as $column) {
                    $data[$column] = (float) $data[$column];
                }

                DB::table('life_tables')->insert($data);
            }
        }
    }
}
