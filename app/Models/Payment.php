<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Payment extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'payments';
    protected $fillable = [
        'name',
        'state',
    ];
    #endregion
    #region Relationships
    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
    #endregion


}
