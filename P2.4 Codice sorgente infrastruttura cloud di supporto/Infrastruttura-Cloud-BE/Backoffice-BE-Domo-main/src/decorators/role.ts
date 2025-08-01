import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from "@visioscientiae/backoffice-packages-domo";

export const Roles = Reflector.createDecorator<UserRoleEnum[]>();