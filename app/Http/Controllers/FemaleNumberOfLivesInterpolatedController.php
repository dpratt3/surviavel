<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FemaleNumberOfLivesInterpolated; 

class FemaleNumberOfLivesInterpolatedController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $femaleNumberOfLivesInterpolatedData = FemaleNumberOfLivesInterpolated::all();

        // Return the data as a JSON response
        return response()->json($femaleNumberOfLivesInterpolatedData);
    }
}
