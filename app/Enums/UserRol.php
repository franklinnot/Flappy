<?php

namespace App\Enums;

enum UserRol: string
{
    case ADMIN = 'Administrador';
    case SELLER = 'Vendedor';

    /**
     * Get an array of all case values.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get an array of all case names.
     * This is useful for validation rules like Rule::in().
     * @return array<string>
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }
}
