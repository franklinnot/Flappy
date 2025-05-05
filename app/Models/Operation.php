<?php

namespace App\Models;
use MongoDB\Laravel\Eloquent\Model;
use MongoDB\Laravel\Relations\BelongsTo;

class Operation extends Model
{
    #region Setup
    protected $connection = 'mongodb';
    protected $table = 'operations';
    protected $fillable = [
        'type',
        'quantity',
        'state',
    ];
    #endregion
    #region Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function lot(): BelongsTo
    {
        return $this->belongsTo(Lot::class);
    }
    #endregion
}
