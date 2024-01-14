<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MaleLifeExpectancyInterpolated; 

class MaleLifeExpectancyInterpolatedController extends Controller
{
    public function index()
    {
        // Retrieve life expectancy data from the database
        $maleLifeExpectancyInterpolatedData = MaleLifeExpectancyInterpolated::all();

        // Return the data as a JSON response
        return response()->json($maleLifeExpectancyInterpolatedData);
    }
}
