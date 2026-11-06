<?php

namespace App\Enums;

enum Role: string
{
    case IctCoordinator = 'ict_coordinator';
    case Principal = 'principal';
    case SnedCoordinator = 'sned_coordinator';
    case Teacher = 'teacher';
    case Parent = 'parent';
}