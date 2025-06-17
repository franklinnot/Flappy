<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;
//
use App\Http\Controllers\Dashboard;
//
use App\Http\Controllers\Users\NewUser;
use App\Http\Controllers\Users\ListUsers;
//
use App\Http\Controllers\Customers\NewCustomer;
use App\Http\Controllers\Customers\ListCustomers;
//
use App\Http\Controllers\Suppliers\NewSupplier;
use App\Http\Controllers\Suppliers\ListSuppliers;
use App\Http\Controllers\Suppliers\EditSuppliers;
use App\Http\Controllers\Suppliers\StatusSuppliers;
//
use App\Http\Controllers\Payments\NewPayment;
use App\Http\Controllers\Payments\ListPayments;
//
use App\Http\Controllers\Units\NewUnit;
use App\Http\Controllers\Units\ListUnits;
//
use App\Http\Controllers\Categories\NewCategory;
use App\Http\Controllers\Categories\ListCategories;
use App\Http\Controllers\Categories\StatusCategorie;
use App\Http\Controllers\Categories\EditCategories;
//
use App\Http\Controllers\Products\NewProduct;
use App\Http\Controllers\Products\ListProducts;
use App\Http\Controllers\Products\StatusProduct;
use App\Http\Controllers\Products\EditProduct;

//
use App\Http\Controllers\Lots\NewLot;
//
use App\Http\Controllers\Operations\NewOperation;
use App\Http\Controllers\Operations\ListOperations;
use App\Http\Controllers\Operations\StatusOperations;

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
    Route::get('users', [ListUsers::class, 'show'])->name('users');

    Route::get('users/new', [NewUser::class, 'show'])->name('users.new');
    Route::post('users/new', [NewUser::class, 'create']);

    Route::patch('users/edit', [ListUsers::class, 'edit'])->name('users.edit');
    Route::patch('users/edit/pass', [RegisteredUserController::class, 'update'])->name('users.edit.pass');

    Route::patch('users/enable/{id}', [ListUsers::class, 'enable'])->name('users.enable');
    Route::patch('users/disable/{id}', [ListUsers::class, 'disable'])->name('users.disable');
    #endregion

    #region Customers
    Route::get('customers', [ListCustomers::class, 'show'])->name('customers');

    Route::get('customers/new', [NewCustomer::class, 'show'])->name('customers.new');
    Route::post('customers/new', [NewCustomer::class, 'create']);

    Route::patch('customers/edit', [ListCustomers::class, 'edit'])->name('customers.edit');

    Route::patch('customers/enable/{id}', [ListCustomers::class, 'enable'])->name('customers.enable');
    Route::patch('customers/disable/{id}', [ListCustomers::class, 'disable'])->name('customers.disable');
    #endregion

    #region Suppliers
    Route::get('suppliers', [ListSuppliers::class, 'show'])->name('suppliers');

    Route::get('suppliers/new', [NewSupplier::class, 'show'])->name('suppliers.new');
    Route::post('suppliers/new', [NewSupplier::class, 'create']);

    Route::patch('suppliers/edit', [EditSuppliers::class, 'edit'])->name('suppliers.edit');

    Route::patch('suppliers/enable/{id}', [StatusSuppliers::class, 'enable'])->name('suppliers.enable');
    Route::patch('suppliers/disable/{id}', [StatusSuppliers::class, 'disable'])->name('suppliers.disable');
    #endregion

    #region Payments
    Route::get('payments', [ListPayments::class, 'show'])->name('payments');

    Route::get('payments/new', [NewPayment::class, 'show'])->name('payments.new');
    Route::post('payments/new', [NewPayment::class, 'create']);

    Route::patch('payments/edit', [ListPayments::class, 'edit'])->name('payments.edit');

    Route::patch('payments/enable/{id}', [ListPayments::class, 'enable'])->name('payments.enable');
    Route::patch('payments/disable/{id}', [ListPayments::class, 'disable'])->name('payments.disable');
    #endregion

    #region Units
    Route::get('units', [ListUnits::class, 'show'])->name('units');

    Route::get('units/new', [NewUnit::class, 'show'])->name('units.new');
    Route::post('units/new', [NewUnit::class, 'create']);

    Route::patch('units/edit', [ListUnits::class, 'edit'])->name('units.edit');

    Route::patch('units/enable/{id}', [ListUnits::class, 'enable'])->name('units.enable');
    Route::patch('units/disable/{id}', [ListUnits::class, 'disable'])->name('units.disable');
    #endregion

    #region Categories
    Route::get('categories', [ListCategories::class, 'show'])->name('categories');

    Route::get('categories/new', [NewCategory::class, 'show'])->name('categories.new');
    Route::post('categories/new', [NewCategory::class, 'create']);

    Route::patch('categories/edit', [EditCategories::class, 'edit'])->name('categories.edit');

    Route::patch('categories/enable/{id}', [StatusCategorie::class, 'enable'])->name('categories.enable');
    Route::patch('categories/disable/{id}', [StatusCategorie::class, 'disable'])->name('categories.disable');
    #endregion

    #region Products
    Route::get('products', [ListProducts::class, 'show'])->name('products');

    Route::get('products/new', [NewProduct::class, 'show'])->name('products.new');
    Route::post('products/new', [NewProduct::class, 'create']);

    Route::patch('products/edit', [EditProduct::class, 'edit'])->name('products.edit');

    Route::patch('products/enable/{id}', [StatusProduct::class, 'enable'])->name('products.enable');
    Route::patch('products/disable/{id}', [StatusProduct::class, 'disable'])->name('products.disable');
    #endregion

    #region Lots
    Route::get('lots', [RegisteredUserController::class, 'show'])->name('lots');

    Route::get('lots/new', [NewLot::class, 'show'])->name('lots.new');
    Route::post('lots/new', [NewLot::class, 'create']);

    Route::patch('lots/edit', [RegisteredUserController::class, 'update'])->name('lots.edit');

    Route::patch('lots/enable/{id}', [RegisteredUserController::class, 'update'])->name('lots.enable');
    Route::patch('lots/disable/{id}', [RegisteredUserController::class, 'update'])->name('lots.disable');
    #endregion

    #region Operations
    Route::get('operations', [ListOperations::class, 'show'])->name('operations');

    Route::get('operations/new', [NewOperation::class, 'show'])->name('operations.new');
    Route::post('operations/new', [NewOperation::class, 'create']);

    Route::patch('operations/disable/{id}', [StatusOperations::class, 'disable'])->name('operations.disable');
    #endregion

    #region Sales
    Route::get('sales', [RegisteredUserController::class, 'show'])->name('sales');

    Route::get('sales/new', [RegisteredUserController::class, 'show'])->name('sales.new');
    Route::post('sales/new', [RegisteredUserController::class, 'create']);

    Route::patch('sales/disable/{id}', [RegisteredUserController::class, 'update'])->name('sales.disable');
    #endregion

});


require __DIR__ . '/auth.php';
