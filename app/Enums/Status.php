<?php

namespace App\Enums;

enum Status: string
{
    case ACTIVE = 'Habilitado';
    case INACTIVE = 'Inhabilitado';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
