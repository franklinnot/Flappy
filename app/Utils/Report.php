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
    // Generates a standardized success response array.
    public static function success(string $route, string $message, array $additionalData = [])
    {
        $data = [
            'report' => [
                'message' => $message,
                'type' => 'success',
            ],
        ];

        return Report::sendResponse($route, array_merge($additionalData, $data));
    }

    // Generates a standardized information response array.
    public static function information(string $route, string $message)
    {
        $data = [
            'report' => [
                'message' => $message,
                'type' => 'information',
            ],
        ];

        return Report::sendResponse($route, $data);
    }

    // Generates a warning response, optionally associating it with a field and throwing an exception
    public static function warning(string $route, string $message, ?string $field = null, bool $exception = true)
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

        if ($exception) {
            throw ValidationException::withMessages($data);
        }

        return Report::sendResponse($route, $data);
    }

    // Generates an error response, optionally associating it with a field and throwing an exception.
    public static function error(string $message, ?string $field = null)
    {
        $data = [
            'report' => ['message' => $message, 'type' => 'error']
        ];

        // If a specific field is provided, add it to the errors array
        if ($field !== null) {
            // Use the field name as the key and the message as the value
            $data[$field] = $message;
        }

        throw ValidationException::withMessages($data);
    }

    // Sends a response with the provided data and route
    public static function sendResponse($route, $data = null)
    {
        return redirect()
            ->route($route)
            ->with($data);
    }
}
