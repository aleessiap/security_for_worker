export interface IRequestWithUser extends Request {
    user: {
        id: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    },
    token: string;
}

const roleEmojiMap = {
    OPERATOR: '🛠️',
    TEAM_LEADER: '👨‍💼',
    SAFETY_MANAGER: '🚧',
    COMPANY_ADMIN: '🖥️',
    SUPER_ADMIN: '👑',
};

export function appendRolesToText(text: string, roles: string[]): string {
    let appendedText = text;

    roles.forEach(role => {
        const emoji = roleEmojiMap[role.toUpperCase()];
        appendedText += ` ${emoji}`;
    });

    return appendedText;
};

export function formatRolesForSwagger(roles: string[]): string {
    if(!roles || roles.length === 0)
        return  '## Public endpoint\n\nThis endpoint is public and does not require any authentication.\n\n';

    let markdown = '## Roles that have access to this endpoint:\n\n';

    roles.forEach(role => {
        const emoji = roleEmojiMap[role.toUpperCase()];
        // Use Markdown's syntax for a level 3 header to make each role stand out
        markdown += `### ${emoji} ${role.replace('_', ' ').toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())}\n`;
    });

    return markdown;
};