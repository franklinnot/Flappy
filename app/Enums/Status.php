<?php

namespace App\Enums;

enum Status: string
{
    case ENABLED = 'Habilitado';
    case DISABLED = 'Inhabilitado';

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
     * Get status formatted 
     *
     * @return array<array{id: string, name: string}>
     */
    public static function valuesWithId(): array
    {
        $status = [];
        foreach (Status::cases() as $case) {
            $status[] = ['id' => $case->name, 'name' => $case->value];
        }
        return $status;
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
