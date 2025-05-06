<?php

namespace App\Helpers;

use InvalidArgumentException;

class EnumHelper
{
    /**
     * Retrieves the backing value of a given enum case.
     *
     * This function takes the fully qualified class name of an enum
     * and the name of one of its cases (e.g., "ADMIN"),
     * and returns the backing value associated with that case (e.g., "Administrador").
     *
     * @param class-string<\UnitEnum&\BackedEnum> $enumClass The fully qualified class name of the enum.
     * @param string $caseName The name of the enum case.
     * @return string|int The backing value of the enum case.
     * @throws InvalidArgumentException If the provided class is not an enum,
     *                                  the case does not exist, or the enum is not a backed enum.
     */
    public static function getValue(string $enumClass, string $caseName): string|int
    {
        if (!enum_exists($enumClass)) {
            throw new InvalidArgumentException("La clase proporcionada {$enumClass} no es un enum válido.");
        }

        $caseConstantPath = $enumClass . '::' . $caseName;

        if (!defined($caseConstantPath)) {
            throw new InvalidArgumentException("El caso {$caseName} no existe en el enum {$enumClass}.");
        }

        $enumCase = constant($caseConstantPath);

        if (!property_exists($enumCase, 'value')) {
            // This check ensures it's a backed enum.
            // For \BackedEnum, 'value' property is guaranteed by PHP.
            // However, an explicit check can be useful if $enumClass wasn't strictly typed as \BackedEnum.
            // Given PHP 8.1+ enums, if it has a backing type, it will have ->value.
            // This exception might be redundant if $enumClass is properly type-hinted as `class-string<\BackedEnum>`.
            throw new InvalidArgumentException("El enum {$enumClass} no parece ser un enum con respaldo (backed enum) o el caso no tiene un valor.");
        }

        return $enumCase->value;
    }
}
