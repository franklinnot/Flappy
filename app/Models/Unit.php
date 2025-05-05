<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Unit extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'units';
    protected $fillable = [
        'name',
        'code',
        'state',
    ];
    #endregion
    #region Relationships
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
    #endregion

    
}
