<?php

namespace App\Enums;

enum Roles: string
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
     * Get roles formatted 
     *
     * @return array<array{id: string, name: string}>
     */
    public static function valuesWithId(): array
    {
        $roles = [];
        foreach (Roles::cases() as $case) {
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
