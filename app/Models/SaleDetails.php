<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;
use MongoDB\Laravel\Relations\BelongsTo;

class SaleDetails extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'saleDetails';
    protected $fillable = [
        'quantity',
        'price',
        'subtotal',
        'lot_id',
        'sale_id',
    ];
    public $timestamps = false;
    #endregion
    #region Relationships
    public function sale(): BelongsTo
    {
        return $this->belongsTo(Sale::class);
    }

    public function lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class);
    }
    #endregion
}
