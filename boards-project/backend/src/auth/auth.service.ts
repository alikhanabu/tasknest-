private async signAndSetCookies(userId: string, email: string, role: string, res: Response) {
  const accessToken = this.jwt.sign({ sub: userId, email, role });
  const refreshToken = uuidv4();
  await this.prisma.refreshToken.create({
    data: { token: refreshToken, userId },
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return { message: 'ok', role };
}