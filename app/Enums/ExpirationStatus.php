<?php

namespace App\Enums;

enum ExpirationStatus: string
{
    case VALID = 'En vigencia';
    case ALERT = 'Próximo a vencer';
    case EXPIRED = 'Vencido';

    // Get an array of all case names.
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    // Get an array of all case values.
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    // Get array formatted: {id: string, name: string}
    public static function valuesWithId(): array
    {
        $status = [];
        foreach (Status::cases() as $case) {
            $status[] = ['id' => $case->name, 'name' => $case->value];
        }
        return $status;
    }
}
