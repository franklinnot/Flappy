<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\HasMany;
use MongoDB\Laravel\Relations\BelongsTo;

class Sale extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'sales';
    protected $fillable = [
        'code',
        'total',
        'status',
    ];
    #endregion
    #region Relationships
    public function saleDetails(): HasMany
    {
        return $this->hasMany(SaleDetails::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    #endregion
}
