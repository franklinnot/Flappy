<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Supplier extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'suppliers';
    protected $fillable = [
        'name',
        'ruc',
        'address',
        'email',
        'phone',
        'status',
    ];
    #endregion
    #region Relationships
    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
    #endregion


}
