<?php

namespace App\Utils;

use InvalidArgumentException;

class EnumHelper
{
    /**
     * Checks if the provided class string represents a valid enum.
     *
     * @param string $enumClass The fully qualified class name to check.
     * @return void
     * @throws InvalidArgumentException If the provided class is not an enum.
     */
    private static function ensureIsEnum(string $enumClass): void
    {
        if (!enum_exists($enumClass)) {
            throw new InvalidArgumentException("La clase proporcionada {$enumClass} no es un enum válido.");
        }
    }

    /**
     * Checks if the provided enum class is a backed enum.
     *
     * @param class-string<\UnitEnum> $enumClass The fully qualified class name of the enum.
     * @return void
     * @throws InvalidArgumentException If the enum is not a backed enum.
     */
    private static function ensureIsBackedEnum(string $enumClass): void
    {
        self::ensureIsEnum($enumClass);
        // A common way to check for backed enums is to see if the first case has a 'value' property
        // or if the enum implements BackedEnum (PHP 8.1+).
        // We can also reflect on the enum and check for a backing type.
        $reflection = new \ReflectionEnum($enumClass);
        if (!$reflection->isBacked()) {
            throw new InvalidArgumentException("El enum {$enumClass} no parece ser un enum con respaldo (backed enum).");
        }
    }

    /**
     * Retrieves the backing value of a specific enum case by its name.
     *
     * Example: EnumHelper::getValue(MyEnum::class, 'CASE_NAME') returns the backing value of MyEnum::CASE_NAME.
     *
     * @template T of \UnitEnum&\BackedEnum
     * @param class-string<T> $enumClass The fully qualified class name of the backed enum.
     * @param string $caseName The name of the enum case (e.g., "ACTIVE", "USER_ROLE").
     * @return string|int The backing value (string or int) of the specified enum case.
     * @throws InvalidArgumentException If the class is not a valid enum, the case doesn't exist,
     *                                  or the enum is not a backed enum.
     */
    public static function getValue(string $enumClass, string $caseName): string|int
    {
        self::ensureIsBackedEnum($enumClass); // Also checks if it's an enum

        $caseConstantPath = $enumClass . '::' . $caseName;

        if (!defined($caseConstantPath)) {
            throw new InvalidArgumentException("El caso {$caseName} no existe en el enum {$enumClass}.");
        }

        /** @var \UnitEnum&\BackedEnum $enumCaseInstance */
        $enumCaseInstance = constant($caseConstantPath);

        // The ensureIsBackedEnum check should guarantee 'value' property exists.
        // However, an explicit check on the instance can be a safeguard if needed,
        // but ReflectionEnum->isBacked() is more robust for the enum type itself.
        return $enumCaseInstance->value;
    }

    /**
     * Retrieves all enum case instances for a given enum class.
     *
     * @template T of \UnitEnum
     * @param class-string<T> $enumClass The fully qualified class name of the enum.
     * @return array<T> An array of enum case instances.
     * @throws InvalidArgumentException If the provided class is not a valid enum.
     */
    public static function getCases(string $enumClass): array
    {
        self::ensureIsEnum($enumClass);
        return $enumClass::cases();
    }

    /**
     * Retrieves all case names for a given enum class.
     *
     * @param class-string<\UnitEnum> $enumClass The fully qualified class name of the enum.
     * @return array<string> An array of case names (strings).
     * @throws InvalidArgumentException If the provided class is not a valid enum.
     */
    public static function getCaseNames(string $enumClass): array
    {
        self::ensureIsEnum($enumClass);
        return array_map(fn(\UnitEnum $case) => $case->name, $enumClass::cases());
    }


    /**
     * Checks if a string is a valid case name for the given enum.
     *
     * @param class-string<\UnitEnum> $enumClass The fully qualified class name of the enum.
     * @param string $caseName The case name to check.
     * @return bool True if it's a valid case name, false otherwise.
     * @throws InvalidArgumentException If the provided class is not a valid enum.
     */
    public static function isValidCaseName(string $enumClass, string $caseName): bool
    {
        self::ensureIsEnum($enumClass);
        $caseConstantPath = $enumClass . '::' . $caseName;
        return defined($caseConstantPath);
    }

    /**
     * Checks if a value is a valid backing value for the given backed enum.
     *
     * @param class-string<\UnitEnum&\BackedEnum> $enumClass The fully qualified class name of the backed enum.
     * @param string|int $value The value to check.
     * @return bool True if it's a valid backing value, false otherwise.
     * @throws InvalidArgumentException If the class is not a valid enum or not a backed enum.
     */
    public static function isValidValue(string $enumClass, string|int $value): bool
    {
        self::ensureIsBackedEnum($enumClass);
        return $enumClass::tryFrom($value) !== null;
    }
}
