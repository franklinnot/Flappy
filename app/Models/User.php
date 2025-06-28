<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use MongoDB\Laravel\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use MongoDB\Laravel\Relations\HasMany;

class User extends Authenticatable
{
    #region Setup
    use HasApiTokens, HasFactory, Notifiable;
    
    protected $connection = 'mongodb';
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'rol',
        'dni',
        'password',
        'status',
    ];
    
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    #endregion
    #region Relationships
    public function operations(): HasMany
    {
        return $this->hasMany(Operation::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }
    #endregion

    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('h:i A d/m/Y');
    }

}
