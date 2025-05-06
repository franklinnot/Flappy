<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;

class Categorie extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'categories';

    protected $fillable = [
        'code',
        'name',
        'status',
    ];
    #endregion
    #region Relationships
    public function products(): HasMany {
        return $this->hasMany(Product::class);
    }
    #endregion
    
    
}
