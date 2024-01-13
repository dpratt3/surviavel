<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;

class FemaleNumberOfLivesInterpolated extends Model
{
    use HasFactory;

    protected $table = 'female_number_of_lives_interpolated';

    protected $fillable = [];

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);

        // dynamically fetch column names
        $this->fillable = array_merge(['year'], Schema::getColumnListing($this->table));
    }
}
