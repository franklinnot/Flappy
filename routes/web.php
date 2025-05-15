<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Dashboard;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::middleware(['auth', 'verify.rol'])->group(function () {

    #region Dashboard
    Route::get('/', [Dashboard::class, 'show']);
    Route::get('dashboard', [Dashboard::class, 'show'])->name('dashboard');
    #endregion

    #region Users
    Route::get('users', [RegisteredUserController::class, 'create'])->name('users');

    Route::get('users/new', [RegisteredUserController::class, 'create'])->name('users.new');
    Route::post('users/new', [RegisteredUserController::class, 'store']);

    Route::patch('users/edit/{id}', [RegisteredUserController::class, 'store'])->name('users.edit');
    Route::patch('users/edit/pass/{id}', [RegisteredUserController::class, 'update'])->name('users.pass');

    Route::patch('users/enable/{id}', [RegisteredUserController::class, 'update'])->name('users.enable');
    Route::patch('users/disable/{id}', [RegisteredUserController::class, 'update'])->name('users.disable');
    #endregion

    #region Customers
    Route::get('customers', [RegisteredUserController::class, 'create'])->name('customers');

    Route::get('customers/new', [RegisteredUserController::class, 'create'])->name('customers.new');
    Route::post('customers/new', [RegisteredUserController::class, 'store']);

    Route::patch('customers/edit/{id}', [RegisteredUserController::class, 'store'])->name('customers.edit');

    Route::patch('customers/enable/{id}', [RegisteredUserController::class, 'update'])->name('customers.enable');
    Route::patch('customers/disable/{id}', [RegisteredUserController::class, 'update'])->name('customers.disable');
    #endregion

    #region Suppliers
    Route::get('suppliers', [RegisteredUserController::class, 'create'])->name('suppliers');

    Route::get('suppliers/new', [RegisteredUserController::class, 'create'])->name('suppliers.new');
    Route::post('suppliers/new', [RegisteredUserController::class, 'store']);

    Route::patch('suppliers/edit/{id}', [RegisteredUserController::class, 'store'])->name('suppliers.edit');

    Route::patch('suppliers/enable/{id}', [RegisteredUserController::class, 'update'])->name('suppliers.enable');
    Route::patch('suppliers/disable/{id}', [RegisteredUserController::class, 'update'])->name('suppliers.disable');
    #endregion

    #region Payments
    Route::get('payments', [RegisteredUserController::class, 'create'])->name('payments');

    Route::get('payments/new', [RegisteredUserController::class, 'create'])->name('payments.new');
    Route::post('payments/new', [RegisteredUserController::class, 'store']);

    Route::patch('payments/edit/{id}', [RegisteredUserController::class, 'store'])->name('payments.edit');

    Route::patch('payments/enable/{id}', [RegisteredUserController::class, 'update'])->name('payments.enable');
    Route::patch('payments/disable/{id}', [RegisteredUserController::class, 'update'])->name('payments.disable');
    #endregion

    #region Units
    Route::get('units', [RegisteredUserController::class, 'create'])->name('units');

    Route::get('units/new', [RegisteredUserController::class, 'create'])->name('units.new');
    Route::post('units/new', [RegisteredUserController::class, 'store']);

    Route::patch('units/edit/{id}', [RegisteredUserController::class, 'store'])->name('units.edit');

    Route::patch('units/enable/{id}', [RegisteredUserController::class, 'update'])->name('units.enable');
    Route::patch('units/disable/{id}', [RegisteredUserController::class, 'update'])->name('units.disable');
    #endregion

    #region Categories
    Route::get('categories', [ProfileController::class, 'edit'])->name('categories');

    Route::get('categories/new', [RegisteredUserController::class, 'create'])->name('categories.new');
    Route::post('categories/new', [RegisteredUserController::class, 'store']);

    Route::patch('categories/edit/{id}', [RegisteredUserController::class, 'store'])->name('categories.edit');

    Route::patch('categories/enable/{id}', [RegisteredUserController::class, 'update'])->name('categories.enable');
    Route::patch('users/disable/{id}', [RegisteredUserController::class, 'update'])->name('users.disable');
    #endregion

    #region Products
    Route::get('products', [RegisteredUserController::class, 'create'])->name('products');

    Route::get('products/new', [RegisteredUserController::class, 'create'])->name('products.new');
    Route::post('products/new', [RegisteredUserController::class, 'store']);

    Route::patch('products/edit/{id}', [RegisteredUserController::class, 'store'])->name('products.edit');

    Route::patch('products/enable/{id}', [RegisteredUserController::class, 'update'])->name('products.enable');
    Route::patch('products/disable/{id}', [RegisteredUserController::class, 'update'])->name('products.disable');
    #endregion

    #region Lots
    Route::get('lots', [RegisteredUserController::class, 'create'])->name('lots');

    Route::get('lots/new', [RegisteredUserController::class, 'create'])->name('lots.new');
    Route::post('lots/new', [RegisteredUserController::class, 'store']);

    Route::patch('lots/edit/{id}', [RegisteredUserController::class, 'store'])->name('lots.edit');

    Route::patch('lots/enable/{id}', [RegisteredUserController::class, 'update'])->name('lots.enable');
    Route::patch('lots/disable/{id}', [RegisteredUserController::class, 'update'])->name('lots.disable');
    #endregion

    #region Operations
    Route::get('operations', [RegisteredUserController::class, 'create'])->name('operations');

    Route::get('operations/new', [RegisteredUserController::class, 'create'])->name('operations.new');
    Route::post('operations/new', [RegisteredUserController::class, 'store']);

    Route::patch('operations/disable/{id}', [RegisteredUserController::class, 'update'])->name('operations.disable');
    #endregion

    #region Sales
    Route::get('sales', [RegisteredUserController::class, 'create'])->name('sales');

    Route::get('sales/new', [RegisteredUserController::class, 'create'])->name('sales.new');
    Route::post('sales/new', [RegisteredUserController::class, 'store']);

    Route::patch('sales/disable/{id}', [RegisteredUserController::class, 'update'])->name('sales.disable');
    #endregion

});


require __DIR__ . '/auth.php';
