<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;
use MongoDB\Laravel\Relations\BelongsTo;

class Product extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'products';
    protected $fillable = [
        'code',
        'name',
        'picture',
        'status',
        'unit_id',
        'categorie_id',
    ];
    #endregion
    #region Relationships
    public function lots(): HasMany
    {
        return $this->hasMany(Lot::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function categorie(): BelongsTo
    {
        return $this->belongsTo(Categorie::class);
    }
    #endregion


}
