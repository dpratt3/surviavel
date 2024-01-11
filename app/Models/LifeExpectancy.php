<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LifeExpectancy extends Model
{
    use HasFactory;

    protected $table = 'life_expectancies';
    
    protected $fillable = [
        'exact_age',
        'male_death_probability',
        'male_number_of_lives',
        'male_life_expectancy',
        'female_death_probability',
        'female_number_of_lives',
        'female_life_expectancy',
        'year',
    ];
}
