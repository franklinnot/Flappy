<?php

namespace App\Helpers;

class SellerRoutes
{
    /**
     * Returns an array of routes based on role 'SELLER'.
     *
     * @return array<int, string>
     */
    public static function getRoutes(): array
    {
        return [
            'profile', // view information
            'customers', // view customers
            'customers/new', // create customer
            'customers/edit/*', // edit customer
            'sales', // view sales
            'sales/new', // create sale
            'sales/disable/*', // disable sale
        ];
    }
}
