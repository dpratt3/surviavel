<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaleNumberOfLivesInterpolated; 

class MaleNumberOfLivesInterpolatedController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $maleNumberOfLivesInterpolatedData = MaleNumberOfLivesInterpolated::all();

        // Return the data as a JSON response
        return response()->json($maleNumberOfLivesInterpolatedData);
    }
}
