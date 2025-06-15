<?php

namespace App\Enums;

enum TypeOperations: string
{
    case INPUT = 'Entrada';
    case OUTPUT = 'Salida';

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
     * Get types operation formatted 
     *
     * @return array<array{id: string, name: string}>
     */
    public static function valuesWithId(): array
    {
        $roles = [];
        foreach (TypeOperations::cases() as $case) {
            $roles[] = ['id' => $case->name, 'name' => $case->value];
        }
        return $roles;
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
