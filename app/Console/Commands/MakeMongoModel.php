<?php

namespace App\Console\Commands;

use Illuminate\Console\GeneratorCommand;
use Illuminate\Support\Str;

class MakeMongoModel extends GeneratorCommand
{
    /**
     * El nombre y la firma del comando de consola.
     *
     * @var string
     */
    protected $signature = 'make:mongo-model {name}';

    /**
     * La descripción del comando de consola.
     *
     * @var string
     */
    protected $description = 'Crea un nuevo modelo compatible con MongoDB';

    /**
     * El nombre del tipo de clase que se está generando.
     *
     * @var string
     */
    protected $type = 'Model';

    /**
     * Obtiene la ruta del archivo stub que se utilizará.
     *
     * @return string
     */
    protected function getStub()
    {
        return base_path('stubs/mongo-model.stub');
    }

    /**
     * Obtiene el espacio de nombres predeterminado para la clase.
     *
     * @param  string  $rootNamespace
     * @return string
     */
    protected function getDefaultNamespace($rootNamespace)
    {
        return $rootNamespace . '\Models';
    }

    /**
     * Reemplaza el nombre de clase en el stub.
     *
     * @param  string  $stub
     * @param  string  $name
     * @return string
     */
    protected function replaceClass($stub, $name)
    {
        $stub = parent::replaceClass($stub, $name);

        $collection = Str::snake(Str::pluralStudly(class_basename($name)));

        return str_replace('{{ collection }}', $collection, $stub);
    }
}
