<?php

namespace App\Enums;

enum UserRol: string
{
    case ADMIN = 'Administrador';
    case SELLER = 'Vendedor';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
