<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit()
    {
        return Inertia::render('Profile/Edit', [
            'user' => $this->getUser(),
        ]);
    }

    private function getUser()
    {
        $id = Auth::user()->id;
        $user = User::select(['name', 'dni', 'rol', 'created_at'])
            ->where('id', $id)
            ->first();

        return [
            'name' => $user->name,
            'dni' => $user->dni,
            'rol' => $user->rol,
            'created_at' => $user->formatted_created_at, 
        ];
    }
}
