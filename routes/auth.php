<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store']);
});

Route::middleware(['auth', 'verify.rol'])->group(function () {
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile');
    Route::patch('profile/edit', [ProfileController::class, 'update'])->name('profile.edit');
    Route::patch('profile/edit/pass', [PasswordController::class, 'update'])->name('profile.pass');
});

Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
