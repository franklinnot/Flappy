<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;
use MongoDB\Laravel\Relations\BelongsTo;

class Lot extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'lots';
    protected $fillable = [
        'code',
        'exp_alert',
        'exp_date',
        'initial_stock',
        'stock',
        'price',
        'exp_status',
        'status',
    ];
    #endregion
    #region Relationships
    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }
    
    public function saleDetails(): HasMany
    {
        return $this->hasMany(SaleDetails::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
    #endregion
}
