<?php

namespace App\Utils;

use Illuminate\Validation\ValidationException;
/**
 * Class Report
 * Provides standardized methods for generating responses, often including toast notifications.
 * Some methods can throw ValidationException based on input parameters.
 */
class Report
{
    /**
     * Generates a standardized success response array.
     *
     * @param string $message The success message for the toast notification.
     * @return array<string, mixed> An array containing toast data with type 'success'.
     */
    public static function success(string $message, array $additionalData = []): array
    {
        $data = [
            'report' => [
                'message' => $message,
                'type' => 'success',
            ],
        ];

        return array_merge($additionalData, $data);
    }

    /**
     * Generates a standardized information response array.
     *
     * @param string $message The information message for the toast notification.
     * @return array<string, mixed> An array containing toast data with type 'information'.
     */
    public static function information(string $message): array
    {
        $data = [
            'report' => [
                'message' => $message,
                'type' => 'information',
            ],
        ];

        return $data;
    }

    /**
     * Generates a warning response, optionally associating it with a field and throwing an exception.
     *
     * @param string $message The warning message for the toast notification.
     * @param string|null $field Optional. The specific input field related to the warning.
     *                           If provided, the message is also added to an array with this field as the key.
     * @param bool $exception Optional (defaults to true). If true, throws ValidationException with the warning data.
     * @return array<string, mixed> If $exception is false, returns an array containing toast data with type 'warning'
     *                              and optionally the field-specific message.
     * @throws \Illuminate\Validation\ValidationException If $exception is true.
     */
    public static function warning(string $message, ?string $field = null, bool $exception = true)
    {
        $data = [
            'report' => [
                'message' => $message, 
                'type' => 'warning'
            ],
        ];

        // If a specific field is provided, add it to the errors array
        if ($field !== null) {
            // Use the field name as the key and the message as the value
            $data[$field] = $message;
        }

        if($exception){
            throw ValidationException::withMessages($data);
        }

        return $data;
    }

    /**
     * Generates an error response, optionally associating it with a field and throwing an exception.
     *
     * @param string $message The error message for the toast notification.
     * @param string|null $field Optional. The specific input field related to the error.
     *                           If provided, the message is also added to an array with this field as the key.
     * @param bool $exception Optional (defaults to true). If true, throws ValidationException with the error data.
     * @return array<string, mixed> If $exception is false, returns an array containing toast data with type 'error'
     *                              and optionally the field-specific message.
     * @throws \Illuminate\Validation\ValidationException If $exception is true.
     */
    public static function error(string $message, ?string $field = null, bool $exception = true)
    {
        $data = [
            'report' => ['message' => $message, 'type' => 'error']
        ];

        // If a specific field is provided, add it to the errors array
        if ($field !== null) {
            // Use the field name as the key and the message as the value
            $data[$field] = $message;
        }

        if ($exception) {
            throw ValidationException::withMessages($data);
        }

        return $data;
    }
}
