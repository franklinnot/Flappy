<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class Dashboard extends Controller
{
    public const COMPONENT = "Dashboard";

    public function show(): Response
    {
        return Inertia::render(self::COMPONENT);
    }
}
