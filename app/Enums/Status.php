<?php

namespace App\Enums;

enum Status: string
{
    case ENABLED = 'Habilitado';
    case DISABLED = 'Inhabilitado';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
