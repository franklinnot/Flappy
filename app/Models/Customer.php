<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Customer extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'customers';
    protected $fillable = [
        'name',
        'dni',
        'phone',
        'status',
    ];
    #endregion
    #region Relationships
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
    #endregion


    
}
